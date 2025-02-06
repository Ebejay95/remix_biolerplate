import type { MetaFunction } from "@remix-run/node";

type MetaProps = {
 title: string;
 description: string;
};

export const createMetaFunction = (meta: MetaProps): MetaFunction => {
 return () => [
   { title: meta.title },
   { name: "description", content: meta.description },
   { property: "og:title", content: meta.title },
   { property: "og:description", content: meta.description }
 ];
};
