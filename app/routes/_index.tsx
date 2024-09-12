import type { MetaFunction } from "@remix-run/node";
import Grid from "~/components/Grid";

export const meta: MetaFunction = () => {
  return [{ title: "amcoff.net" }];
};

export default function Index() {
  return (
    <div className="flex items-center justify-center min-h-screen font-sans p-8">
      <Grid />
    </div>
  );
}
