"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { validationSchemaSignUp } from "@/models/forms";
import { FormInputsSignUp } from "@/globaltypes/types";
import GreenButton from "../buttons/GreenButton";
import { toast } from "react-toastify";

const SingUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputsSignUp>({
    resolver: async (data) => {
      try {
        await validationSchemaSignUp.validateAsync(data, { abortEarly: false });
        return { values: data, errors: {} };
      } catch (error: any) {
        const validationErrors: Record<string, { message: string }> = {};
        if (error.details) {
          error.details.forEach(
            (detail: { context: { key: string | number }; message: any }) => {
              if (detail.context && detail.context.key) {
                validationErrors[detail.context.key] = {
                  message: detail.message,
                };
              }
            }
          );
        }
        return {
          values: {},
          errors: validationErrors,
        };
      }
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<FormInputsSignUp> = async (data) => {
    const res = await fetch("http://localhost:3000/api/users/signup", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        user_login: data.login,
        user_password: data.password,
        tel: data.phone,
        user_name: data.name,
      }),
    });
    if (res && res.ok) {
      const credentialsRes = await signIn("credentials", {
        login: data.login,
        password: data.password,
        redirect: false,
      });
      if (credentialsRes && !credentialsRes.error) {
        router.push("/mailing-list");
        toast.success(`Wellcome ${data.login}`)
      }
    }
  };

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className="w-[526px] flex justify-items-center  items-center flex-col leading-6 px-[26px] "
    >
      <div className="text-left w-full mb-8">
        <label
          htmlFor="name"
          className="font-roboto text-base font-medium mb-2 block"
        >
          Ім’я
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full border py-2 px-3 focus:outline-none focus:border-blue-500 rounded-[18px] input"
          required
        />
        {errors.name && (
          <span className="text-red-500 block">{errors.name.message}</span>
        )}

        <label
          htmlFor="phone"
          className="font-roboto text-base font-medium mb-2  mt-8 block"
        >
          Телефон
        </label>
        <input
          id="phone"
          type="text"
          {...register("phone")}
          className="w-full border py-2 px-3 focus:outline-none focus:border-blue-500 rounded-[18px] input"
          required
        />
        {errors.phone && (
          <span className="text-red-500 block">{errors.phone.message}</span>
        )}

        <label
          htmlFor="email"
          className="font-roboto text-base font-medium mb-2  mt-8 block"
        >
          Пошта
        </label>
        <input
          id="email"
          type="text"
          {...register("email")}
          className="w-full border py-2 px-3 focus:outline-none focus:border-blue-500 rounded-[18px] input"
          required
        />
        {errors.email && (
          <span className="text-red-500 block">{errors.email.message}</span>
        )}

        <label
          htmlFor="login"
          className="font-roboto text-base font-medium mb-2  mt-8 block"
        >
          Логін
        </label>
        <input
          id="login"
          type="text"
          {...register("login")}
          className="w-full border py-2 px-3 focus:outline-none focus:border-blue-500 rounded-[18px] input"
          required
        />
        {errors.login && (
          <span className="text-red-500 block">{errors.login.message}</span>
        )}

        <label
          htmlFor="password"
          className="font-roboto text-base font-medium mb-2  mt-8 block"
        >
          Пароль
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="w-full border py-2 px-3 focus:outline-none focus:border-blue-500 rounded-[18px] input"
          required
        />
        {errors.password && (
          <span className="text-red-500 ">{errors.password.message}</span>
        )}
        <label
          htmlFor="repeatPassword"
          className="font-roboto text-base font-medium mb-2  mt-8 block"
        >
          Підтвердіть пароль
        </label>
        <input
          id="repeatPassword"
          type="repeatPassword"
          {...register("repeatPassword")}
          className="w-full border py-2 px-3 focus:outline-none focus:border-blue-500 rounded-[18px] input"
          required
        />
        {errors.repeatPassword && (
          <span className="text-red-500 ">{errors.repeatPassword.message}</span>
        )}
      </div>
      <GreenButton size="big">Реєстрація</GreenButton>
    </form>
  );
};

export { SingUpForm };
