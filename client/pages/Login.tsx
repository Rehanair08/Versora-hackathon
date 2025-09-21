import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="container mx-auto py-12 flex items-center justify-center">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center">Sign in to Versora</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button className="w-full">Log in</Button>
          <p className="text-xs text-muted-foreground text-center">
            By continuing you agree to our terms.
          </p>
          <p className="text-sm text-center">
            No account?{" "}
            <Link to="/" className="text-primary">
              Explore as guest
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
