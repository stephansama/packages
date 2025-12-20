declare module "barhandles" {
	interface Barhandle {
		extractSchema: (file: string) => object;
	}

	const barhandle: Barhandle;

	export default barhandle;
}
