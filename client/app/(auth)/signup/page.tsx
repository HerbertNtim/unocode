"use client";

import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
interface IFormInput {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ name, email, password }: IFormInput) => {
    const data = { name, email, password };
    console.log(data);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        border: "1px solid",
        borderColor: "secondary.main",
        borderRadius: 2,
        padding: 2,
        boxShadow: 3,
        backgroundColor: "#00004a",
      }}
    >
      <Box sx={{ mt: 0 }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          className="text-center font-Poppins dark:text-white p-1 mb-8 rounded-sm"
        >
          SignUp with Unocode
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Full Name is required",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Name"
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ""}
                  variant="filled"
                  className="dark:bg-slate-300 bg-slate-40"
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                  variant="filled"
                  className="dark:bg-slate-300 bg-slate-400"
                />
              )}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password should be at least 6 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <AiFillEye />
                          ) : (
                            <AiFillEyeInvisible />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  className="dark:bg-slate-300 bg-slate-400"
                />
              )}
            />
          </Box>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{
              marginTop: 2,
              padding: 1.5,
            }}
            onClick={handleSubmit(onSubmit)}
          >
            SignUp
          </Button>
        </form>
      </Box>
      <Typography
        variant="h6"
        component="h6"
        gutterBottom
        className="text-center font-Poppins dark:text-white py-4  mb-8 rounded-sm"
      >
        {"Already have an account? "}
        <Link href="/login" className="text-[crimson]">
          Log in now
        </Link>
      </Typography>
    </Container>
  );
};

export default SignUp;
