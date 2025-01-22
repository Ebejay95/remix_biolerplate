import { useLoaderData } from "@remix-run/react";
import { createLoader } from "~/utils/route-utils";
import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

interface AboutData {
  title: string;
  description: string;
  features: {
    title: string;
    description: string;
  }[];
  team: {
    name: string;
    role: string;
    bio: string;
  }[];
}

function getAboutData(): AboutData {
  return {
    title: "About Our Platform",
    description: "A modern, secure user management system built with Remix and MongoDB",
    features: [
      {
        title: "Secure Authentication",
        description: "Industry-standard security practices with bcrypt password hashing and session management"
      },
      {
        title: "User Management",
        description: "Comprehensive user management with role-based access control"
      },
      {
        title: "Dark Mode Support",
        description: "Full dark mode support with system preference detection"
      }
    ],
    team: [
      {
        name: "Development Team",
        role: "Core Team",
        bio: "Our dedicated development team building the future of user management"
      }
    ]
  };
}

export const loader = createLoader(getAboutData);

export const meta: MetaFunction = () => {
	return [
		{ title: "About | Remix Boilerplate" },
		{ name: "description", content: "Information about the project." },
		{ property: "og:title", content: "About | Remix Boilerplate" },
		{ property: "og:description", content: "Information about the project." },
	];
  };

export default function About() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">{data.title}</h1>
          <p className="mt-4 text-lg opacity-75">
            {data.description}
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Features</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.features.map((feature, index) => (
              <div key={index} className="dashboard-card p-6 rounded-lg">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm opacity-75">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Our Team</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {data.team.map((member, index) => (
              <div key={index} className="dashboard-card p-6 rounded-lg">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="mt-1 text-sm font-medium opacity-75">{member.role}</p>
                <p className="mt-4 text-sm opacity-75">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
		<div className="mx-auto mt-16">
          <Link to="/" className="btn-secondary text-center">
            Back Home
          </Link>
		  </div>
      </div>
    </div>
  );
}