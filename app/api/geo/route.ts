import { geolocation } from "@vercel/functions";

export const GET = (request: Request) => {
  console.log(request);

  const details = geolocation(request);
  console.log(details);

  return Response.json(details);
};
