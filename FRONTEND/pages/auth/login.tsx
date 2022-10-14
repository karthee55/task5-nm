import React, { useState } from "react";
import Layout from "@/layouts/MainLayout";
import { UseInput } from "@/hooks/useInput";
import { Button, Form, Input, message } from "antd";
import { isEmailValid, isPasswordValid } from "@/utils/valid";
import { useAppDispatch } from "../../app/hooks/redux";
import Link from "next/link";
import { authSlice } from "@/store/reducers/authSlice";
import AuthService from "@/api/services/AuthService";
import { useRouter } from "next/router";
import { NextPage } from "next";
import Logo from "@/components/utils/Logo";

const Login: NextPage = () => {
  const router = useRouter();
  const { loginAuth } = authSlice.actions;
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const email = UseInput("");
  const password = UseInput("");

  const login = () => {
    setLoading(true);
    if (isPasswordValid(password.value) && isEmailValid(email.value)) {
      AuthService.login(email.value, password.value)
        .then((res) => {
          if (res.data.user.active) {
            dispatch(loginAuth(res.data));
            message.success("successful login");
            router.push("/");
          } else {
            message.error(
              "your account is not activated, please check your email"
            );
          }
        })
        .catch((e) => {
          message.error("incorrect password");
        });
    } else {
      message.error("enter correct email or password");
    }
    setLoading(false);
  };

  return (
    <Layout col={1} title="Login">
      <div className="center">
        <Form
          className="container"
          name="login"
          id="login"
          initialValues={{ remember: true }}
          onFinish={login}
          autoComplete="off"
          role="form"
        >
          <Logo />
          <Input placeholder="email" className="containerItem" {...email} />
          <Input.Password
            placeholder="password"
            className="containerItem"
            maxLength={32}
            minLength={8}
            {...password}
          />
          <Button type="primary" className="containerItem" onClick={login}>
            Login
          </Button>

          <Link href="/auth/register">
            <Button
              type="link"
              className="containerItem"
              size="small"
              disabled={loading}
              loading={loading}
            >
              or register
            </Button>
          </Link>
        </Form>
      </div>
    </Layout>
  );
};

export default Login;
