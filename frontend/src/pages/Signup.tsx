import React, { useEffect } from "react";
import { IoIosLogIn } from "react-icons/io";
import { Box, Typography, Button } from "@mui/material";
import CustomedInput from "../components/shared/CustomedInput";
import { toast } from "react-hot-toast";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Signup = () => {
  const navigate = useNavigate();
  const auth = UserAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      toast.loading("Signing Up", { id: "signup" });
      await auth?.signup(name, email, password);
      toast.success("Signed Up Successfully", { id: "signup" });
    } catch (error) {
      console.log(error);
      toast.error("Signing Up Failed", { id: "signup" });
    }
  };
  useEffect(() => {
    if (auth?.user) {
      return navigate("/chat");
    }
  }, [auth]);
  return (
    <Box width={"100%"} height={"100%"} display="flex" flex={1}>
      <Box padding={8} mt={8} display={{ md: "flex", sm: "none", xs: "none" }}>

        <img src="johnysignup.jpg" alt="JohnnySignup"
          style={{
            width: "400px",
            margin: "auto",
            textAlign: "center",
            padding: "20px",
            borderRadius: "10px",
            // border: "2px solid #64f3d5",
            // boxShadow: "10px 10px 20px #000",
          }} />

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          flex={1}
          style={{
            border: "2px solid #64f3d5",
            textAlign: "center",
            padding: "20px",
            margin: "auto",
            width: "80%",
            height: "80%",
            borderRadius: "10px",
            boxShadow: "10px 10px 20px #000",
          }}
        >


          <Typography
            variant="h4"
            style={{
              marginBottom: "20px",
              fontSize: "24px",
              color: "white",
              fontWeight: "bold",
              textShadow: "2px 2px #000",
              textAlign: "center",
            }}

          >
            Hi, I'm ChatterMind, I'm a ChatterMind 🤖, and I'm here to help you with your queries.
            Sign up and start chatting today!
          </Typography>
        </Box>


      </Box>

      <Box
        display={"flex"}
        flex={{ xs: 1, md: 0.5 }}
        justifyContent={"center"}
        alignItems={"center"}
        padding={2}
        ml={"auto"}
        mt={16}
      >


        <form
          onSubmit={handleSubmit}
          style={{
            margin: "auto",
            padding: "30px",
            boxShadow: "10px 10px 20px #000",
            borderRadius: "10px",
            border: "none",
            textAlign: "center",
            textShadow: "2px 2px #000",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              padding={2}
              fontWeight={600}
            >
              Signup
            </Typography>
            <CustomedInput type="text" name="name" label="Name" />
            <CustomedInput type="email" name="email" label="Email" />
            <CustomedInput type="password" name="password" label="Password" />
            <Button
              type="submit"
              sx={{
                px: 2,
                py: 1,
                mt: 2,
                width: "400px",
                borderRadius: 2,
                bgcolor: "#00fffc",
                ":hover": {
                  bgcolor: "white",
                  color: "black",
                },
              }}
              endIcon={<IoIosLogIn />}
            >
              Signup
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Signup;