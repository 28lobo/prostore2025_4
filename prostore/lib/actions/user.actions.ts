'use server';

import { signInFormSchema, signUpFormSchema } from "../validators";
import {signIn, signOut} from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {hashSync} from 'bcrypt-ts-edge'
import { prisma } from '@/db/prisma'
import { formatError } from "../utils";


// Sign in user with credentials
export async function signInWithCredentials(prevState: unknown, formData:FormData){ 
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        });
        await signIn('credentials', user)
        return {success: true, message: 'User signed in successfully'}
    } catch (error) {
        if(isRedirectError(error)){
            throw error
        }
        return {success: false, message: 'Invalid email of password'}
    }
}

// sign user out
export async function signOutUser(){
    await signOut()
}

// sign up user 
export async function signUpUser(prevState: unknown, formData: FormData) { 
    try {
      const user = signUpFormSchema.parse({
        name: String(formData.get('name')),
        email: String(formData.get('email')),
        password: String(formData.get('password')),
        confirmPassword: String(formData.get('confirmPassword')),
        role: String(formData.get('role'))
      });
      const plainPassword = user.password;
  
      // Hash the password before storing it in the database.
      user.password = hashSync(user.password, 10);
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role
        }
      });
      // After creating the user, sign them in using the plain password.
      await signIn('credentials', {
        email: user.email,
        password: plainPassword
      });
      return { success: true, message: 'User created successfully' };
    } catch (error) {
      
      if (isRedirectError(error)) {
        throw error;
      }
      return { success: false, message: formatError(error) };
    }
  }

  // get a user by id
  export async function getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id
        }
      });
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }
  