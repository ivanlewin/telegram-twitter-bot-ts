import needle from "needle";
import { filteredStreamRule } from "./types";
import { parseConfig } from "./helpers";

const FILTERED_STREAM_RULES_URL = "https://api.twitter.com/2/tweets/search/stream/rules";
const FILTERED_STREAM_URL = "https://api.twitter.com/2/tweets/search/stream?tweet.fields=context_annotations,created_at&expansions=author_id";
// const SAMPLE_STREAM_URL = "https://api.twitter.com/2/tweets/sample/stream?tweet.fields=context_annotations,created_at&expansions=author_id";

/** Compara los arrays de reglas, para evitar setear las mismas una y otra vez */
const areRulesEqual = function (previousRules: any[], configRules: filteredStreamRule[]): boolean {

	// Chequeo que el número de reglas sea el mismo
	if (previousRules.length !== configRules.length) return false;

	// Hago una copia de los arrays
	const prevRules = previousRules.map(x => ({ ...x }));
	const confRules = configRules.map(x => ({ ...x }));

	// Ordeno los arrays por tag
	const sortedPrevRules = prevRules.sort((a, b) => (a.tag > b.tag ? 1 : -1));
	const sortedConfRules = confRules.sort((a, b) => (a.tag > b.tag ? 1 : -1));

	// Voy por cada item chequeando que el tag y el value sean iguales
	for (let i = 0; i < sortedPrevRules.length - 1; i++) {
		if (
			sortedPrevRules[i].tag !== sortedConfRules[i].tag ||
			sortedPrevRules[i].value !== sortedConfRules[i].value
		) {
			return false;
		}
	}

	return true;
}

/** Getea las reglas actualmente aplicadas al FilteredStream
 * 
 * Basado en https://github.com/twitterdev/Twitter-API-v2-sample-code/blob/521c873751d505e65534b350ceb539ddb4f8d6b8/Filtered-Stream/filtered_stream.js#L30
 * 
 * @param {string} token El Bearer Token de la app
 */
const getStreamRules = async function (token: string) {

	const response = await needle("get", FILTERED_STREAM_RULES_URL, {
		headers: {
			"authorization": `Bearer ${token}`
		}
	});

	if (response.statusCode !== 200) {
		throw new Error(response.body);
	}

	return (response.body);
};

/** Borra las reglas aplicadas al FilteredStream
 * 
 * Basado en https://github.com/twitterdev/Twitter-API-v2-sample-code/blob/521c873751d505e65534b350ceb539ddb4f8d6b8/Filtered-Stream/filtered_stream.js#L45
 */
const deleteStreamRules = async function (token: string, rules: { data: any }): Promise<any> {

	if (!Array.isArray(rules.data)) {
		return null;
	}

	const ids = rules.data.map(rule => rule.id);

	const data = {
		"delete": {
			"ids": ids
		}
	};

	const response = await needle("post", FILTERED_STREAM_RULES_URL, data, {
		headers: {
			"content-type": "application/json",
			"authorization": `Bearer ${token}`
		}
	});

	if (response.statusCode !== 200) {
		throw new Error(response.body);
	}

	return (response.body);
};

/** Setea las reglas al FilteredStream
 * 
 * https://github.com/twitterdev/Twitter-API-v2-sample-code/blob/521c873751d505e65534b350ceb539ddb4f8d6b8/Filtered-Stream/filtered_stream.js#L74
 */
const setStreamRules = async function (token: string, rules: any) {

	const data = {
		"add": rules
	};

	const response = await needle("post", FILTERED_STREAM_RULES_URL, data, {
		headers: {
			"content-type": "application/json",
			"authorization": `Bearer ${token}`
		}
	});

	if (response.statusCode !== 201) {
		throw new Error(response.body);
	}

	return (response.body);
};

/** Getea las reglas ya seteadas y las que se quieren setear,
 * las compara y, de no ser iguales, las setea en el Rules Endpoint
 */
export const setFilteredStreamRules = async function (token: string, compare = false, log = false) {

	const filteredStreamRules = parseConfig();

	const previousRules = await getStreamRules(token);
	if (compare && areRulesEqual(previousRules.data, filteredStreamRules)) { return filteredStreamRules }

	if (log) console.log("Reglas anteriores:", previousRules);

	const deletedRules = await deleteStreamRules(token, previousRules);
	if (log) console.log("Reglas borradas:", deletedRules);

	await setStreamRules(token, filteredStreamRules);

	return filteredStreamRules;
}

/** Establece una HTTP persistent connection con el Stream **/
export const streamConnect = function streamConnect(token: string) {

	const stream = needle.get(FILTERED_STREAM_URL, {
		headers: { Authorization: `Bearer ${token}` },
		timeout: 20000
	});

	stream.on("error", error => {
		console.error(error);
		if (error.code === "ETIMEDOUT") stream.emit("timeout");
	});

	return stream;
};