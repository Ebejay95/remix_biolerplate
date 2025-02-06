import { useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { createMetaFunction } from "~/utils/meta";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return json({});
};

export const meta = createMetaFunction({
 title: "About | Remix Boilerplate",
 description: "Information about the project"
});

export default function About() {
 const { title, description, features, team } = useLoaderData<typeof loader>();

 return (
   <div className="min-h-screen py-12">
     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
       <div className="text-center">
         <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
         <p className="mt-4 text-lg opacity-75">{description}</p>
       </div>

       <div className="mt-16">
         <h2 className="text-2xl font-bold tracking-tight">Features</h2>
         <div className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
             <div className="dashboard-card p-6 rounded-lg">
               <h3 className="text-lg font-semibold">About</h3>
               <p className="mt-2 text-sm opacity-75">Text</p>
             </div>
             <div className="dashboard-card p-6 rounded-lg">
               <h3 className="text-lg font-semibold">About</h3>
               <p className="mt-2 text-sm opacity-75">Text</p>
             </div>
             <div className="dashboard-card p-6 rounded-lg">
               <h3 className="text-lg font-semibold">About</h3>
               <p className="mt-2 text-sm opacity-75">Text</p>
             </div>
         </div>
       </div>

       <div className="mt-16">
         <h2 className="text-2xl font-bold tracking-tight">Our Team</h2>
         <div className="mt-6 grid gap-8 md:grid-cols-2">
             <div className="dashboard-card p-6 rounded-lg">
               <h3 className="text-lg font-semibold">About</h3>
               <p className="mt-2 text-sm opacity-75">Text</p>
             </div>
             <div className="dashboard-card p-6 rounded-lg">
               <h3 className="text-lg font-semibold">About</h3>
               <p className="mt-2 text-sm opacity-75">Text</p>
             </div>
         </div>
       </div>

       <div className="mx-auto mt-16">
         <Link to="/" className="btn-secondary text-center">Back Home</Link>
       </div>
     </div>
   </div>
 );
}
