import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useAuth from "@/contexts/AuthContext";
import { useState, type SubmitEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { Spinner } from "@/components/ui/spinner";

const Login = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { login } = useAuth();
  const [loggingIn, setLogginIn] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(loggingIn) return;

    if (!formData.username || !formData.password) {
      alert("username and Password are required!");
      return;
    }
    try {
      setLogginIn(true);
      const response: boolean = await login(
        formData.username,
        formData.password,
      );
      if (response) {
        const from = location.state?.from || "/";
        navigate(from);
      }
    } catch (error) {
      alert(error);
    } finally {
      setLogginIn(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-10 md:p-16" onSubmit={handleLogin}>
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Welcome back, Admin</h1>
                    <p className="text-muted-foreground text-balance">
                      Login to your account
                    </p>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      id="username"
                      type="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      placeholder="Username"
                      required
                      className="py-5"
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Password"
                      required
                      className="py-5"
                    />
                  </Field>
                  <Field>
                    <Button variant={"default"} className="py-6" type="submit">
                      {loggingIn ? (
                        <span className="text-background flex items-center gap-2"><Spinner color="#fff"/> Loading</span>
                      ) : (
                        <span className="text-background ">Login</span>
                      )}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
              <div className="bg-muted relative hidden md:block">
                <img
                  src="/placeholder.svg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
