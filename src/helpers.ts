import { filteredStreamRule } from "./types";
import configRules from "./rules.json";

export const parseConfig = function (): filteredStreamRule[] {
	return configRules.map(element => ({
		"value": element.filteredStreamRule,
		"tag": element.tag
	}));
};