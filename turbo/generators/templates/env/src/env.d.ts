declare global {
	namespace NodeJS {
		interface ProcessEnv extends ExtendEnvironment {}
	}
}

interface ExtendEnvironment {}

export {};
