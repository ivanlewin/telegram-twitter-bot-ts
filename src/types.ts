import { Telegraf } from "telegraf";

export interface Tweet {
	data: any;
	created_at: any,
	includes: any,
	matching_rules: any[]
}

export interface filteredStreamRule {
	value: string,
	tag: string
}

export interface configRule {
	filteredStreamRule: string,
	telegramChannelID: string,
	tag: string
}

export interface TelegramBot extends Telegraf {
	configRules: configRule[]
}