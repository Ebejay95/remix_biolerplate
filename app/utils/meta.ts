type MetaProps = {
	title: string;
	description: string;
};

export function generateMeta({ title, description }: MetaProps) {
	return [
		{ title },
		{ name: "description", content: description },
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
	];
}