import { useLoaderData } from "@remix-run/react";
import { createLoader } from "../utils/route-utils";

interface AboutData {
	title: string;
	description: string;
	team: {
		name: string;
		role: string;
	}[];
}

// Gemeinsame Datenfunktion
function getAboutData(): AboutData {
	return {
		title: "Über uns",
		description: "Willkommen auf unserer About-Seite",
		team: [
			{ name: "Max Mustermann", role: "CEO" },
			{ name: "Erika Musterfrau", role: "CTO" },
		],
	};
}

// Loader der für beide Formate verwendet wird
export const loader = createLoader(getAboutData);

// React-Komponente für HTML-Rendering
export default function About() {
	const data = useLoaderData<typeof loader>();

	return (
		<div className="max-w-4xl mx-auto py-12 px-4">
			<h1 className="text-3xl font-bold mb-6">{data.title}</h1>
			<p className="text-lg mb-8">{data.description}</p>

			<h2 className="text-2xl font-semibold mb-4">Unser Team</h2>
			<div className="grid gap-4">
				{data.team.map((member) => (
					<div key={member.name} className="border p-4 rounded-lg">
						<h3 className="font-medium">{member.name}</h3>
						<p className="text-gray-600">{member.role}</p>
					</div>
				))}
			</div>
		</div>
	);
}