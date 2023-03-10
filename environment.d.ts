declare global {
	namespace NodeJS {
		interface ProcessEnv {
			botToken: string;
			guildId: string;
			mongoDB: string;
			huggingfaceApiKey: string;
			modelVersion: number;
		}
	}
}

export {};
