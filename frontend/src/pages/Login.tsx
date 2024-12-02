// import React, { useEffect } from "react";
// import { IoIosLogIn } from "react-icons/io";
// import { Box, Typography, Button } from "@mui/material";
// import CustomedInput from "../components/shared/CustomedInput";
// import { toast } from "react-hot-toast";
// import { UserAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// const Login = () => {
//   const navigate = useNavigate();
//   const auth = UserAuth();
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;
//     try {
//       toast.loading("Signing In", { id: "login" });
//       await auth?.login(email, password);
//       toast.success("Signed In Successfully", { id: "login" });
//     } catch (error) {
//       console.log(error);
//       toast.error("Signing In Failed", { id: "login" });
//     }
//   };


//   useEffect(() => {
//     if (auth?.user) {
//       return navigate("/chat");
//     }
//   }, [auth]);
//   return (
//     <Box width={"100%"} height={"100%"} display="flex" flex={1}>
//     <Box padding={8} mt={8} display={{ md: "flex", sm: "none", xs: "none" }}>
  
//       <img src="https://art.pixilart.com/e2c9a03b155bcbe.gif" alt="My GIF" 
//         style={{
//           width: "400px",
//           margin: "auto",
//           textAlign: "center",
//           padding: "20px",
//           borderRadius: "10px",
   
//         }} />

//       <Box
//         display="flex"
//         flexDirection="column"
//         alignItems="center"
//         justifyContent="center"
//         flex={1}
//         style={{
//           border: "2px solid #64f3d5",
//           textAlign: "center",
//           padding: "20px",
//           margin: "auto",
//           width: "80%",
//           height: "80%",
//           borderRadius: "10px",
//           boxShadow: "10px 10px 20px #000",
//         }}
//       >


//         <Typography
//           variant="h4"
//           style={{
//             marginBottom: "20px",
//             fontSize: "24px",
//             color: "white",
//             fontWeight: "bold",
//             textShadow: "2px 2px #000",
//             textAlign: "center",
//           }}

//         >
//           Hi, I'm ChatterMind Welcome to the Login Page Please enter your credentials to login so I can assist you. 🤖
//           Not a user? Please Sign Up Today! 🚀💻
//         </Typography>
//       </Box>


//     </Box>

//     <Box
//       display={"flex"}
//       flex={{ xs: 1, md: 0.5 }}
//       justifyContent={"center"}
//       alignItems={"center"}
//       padding={2}
//       ml={"auto"}
//       mt={16}
//     >
//         <form
//           onSubmit={handleSubmit}
//           style={{
//             margin: "auto",
//             padding: "30px",
//             boxShadow: "10px 10px 20px #000",
//             borderRadius: "10px",
//             border: "none",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//             }}
//           >
//             <Typography
//               variant="h4"
//               textAlign="center"
//               padding={2}
//               fontWeight={600}
//             >
//               Login
//             </Typography>
//             <CustomedInput type="email" name="email" label="Email" />
//             <CustomedInput type="password" name="password" label="Password" />
//             <Button
//               type="submit"
//               sx={{
//                 px: 2,
//                 py: 1,
//                 mt: 2,
//                 width: "400px",
//                 borderRadius: 2,
//                 bgcolor: "#00fffc",
//                 ":hover": {
//                   bgcolor: "white",
//                   color: "black",
//                 },
//               }}
//               endIcon={<IoIosLogIn />}
//             >
//               Login
//             </Button>
//           </Box>
//         </form>
//       </Box>
//     </Box>
//   );
// };

// export default Login;



import React, { useEffect } from "react";
import { IoIosLogIn } from "react-icons/io";
import { Box, Typography, Button } from "@mui/material";
import CustomedInput from "../components/shared/CustomedInput";
import { toast } from "react-hot-toast";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const auth = UserAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      toast.loading("Signing In", { id: "login" });
      await auth?.login(email, password);
      toast.success("Signed In Successfully", { id: "login" });

      // Trigger speech synthesis after successful login
      const message = "Welcome to the World of ChatterMind";
      speakMessage(message);

      // Navigate to the chat page
      navigate("/chat");
    } catch (error) {
      console.log(error);
      toast.error("Signing In Failed", { id: "login" });
    }
  };

  // Function to speak a message
  const speakMessage = (message: string) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = speechSynthesis.getVoices().find(
      (voice) => voice.name.toLowerCase().includes("robot")
    ) || speechSynthesis.getVoices()[0]; // Fallback to the first available voice
    utterance.rate = 1; // Adjust the speed of the voice if needed
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (auth?.user) {
      navigate("/chat");
    }
  }, [auth, navigate]);

  return (
    <Box width={"100%"} height={"100%"} display="flex" flex={1}>
      <Box padding={8} mt={8} display={{ md: "flex", sm: "none", xs: "none" }}>
        <img
          src="https://art.pixilart.com/e2c9a03b155bcbe.gif"
          alt="My GIF"
          style={{
            width: "400px",
            margin: "auto",
            textAlign: "center",
            padding: "20px",
            borderRadius: "10px",
          }}
        />
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
            Hi, I'm ChatterMind Welcome to the Login Page. Please enter your
            credentials to login so I can assist you. 🤖 Not a user? Please Sign
            Up Today! 🚀💻
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
              Login
            </Typography>
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
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
