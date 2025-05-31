'use server';

import { shippingAddressSchema, signInFormSchema, signUpFormSchema, paymentMethodSchema, updateUserSchema } from "../validators";
import { z } from "zod";
import {auth,signIn, signOut} from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {hashSync} from 'bcrypt-ts-edge'
import { prisma } from '@/db/prisma'
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";


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

  // update user address
  export async function updateUserAddress(data: ShippingAddress) {
    try {
      const session = await auth()

      const currentUser = await prisma.user.findFirst({
        where: {
          id: session?.user?.id
        }
      });

      if (!currentUser) {
        throw new Error('User not found')
      }

      const address = shippingAddressSchema.parse(data)

      await prisma.user.update({
        where: {
          id: currentUser.id
        },
        data: {
          address
        }
      })
      return {success: true, message: 'Address updated successfully'}

    }catch(error){
      return {success: false, message: formatError(error)}
    }
  }

  // Update user payment method
  export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
    try {
      const session = await auth()
      const currentUser = await prisma.user.findFirst({
        where: {
          id: session?.user?.id
        }
      });
      if (!currentUser) {
        throw new Error('User not found')
      }
      const paymentMethod = paymentMethodSchema.parse(data)
      // update database
      await prisma.user.update({
        where: {
          id: currentUser.id
        },
        data: {
          paymmentMethod: paymentMethod.type
        }
      });
      return {success: true, message: 'Payment method updated successfully'}
    }catch(error){
      return {success: false, message: formatError(error)}
    }
  }

  // Update user profile
  export async function updateProfile(user: {name: string; email: string}){
    try {
      const session = await auth()
      const currentUser = await prisma.user.findFirst({
        where: {
          id: session?.user?.id
        }
      });
      if (!currentUser) {
        throw new Error('User not found')
      }
      
      await prisma.user.update({
        where: {
          id: currentUser.id
        },
        data: {
          name: user.name,
          
        }
      });
      return {success: true, message: 'Profile updated successfully'}
      
    } catch (error) {
      return {success: false, message: formatError(error)}
    }
  }

  // get all users
  export async function getAllUsers({
    limit = PAGE_SIZE,
    page,
  }: {
    limit?: number;
    page: number;
  }) {
    // create query to get all users
    const data = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const dataCount = await prisma.user.count();
    return {
      data,
      totalPages: Math.ceil(dataCount / limit),
    };
  }

// delete user
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: {
        id
      }
    });
    revalidatePath('/admin/users')
    return {success: true, message: 'User deleted successfully'}
  }catch(error){
    return {success: false, message: formatError(error)}
  }
}

// updater user 
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        name: user.name,
        role: user.role
      }
    })
    revalidatePath('/admin/user')

    return {success: true, message: 'User updated successfully'}
  } catch (error) {
    return {success: false, message: formatError(error)}
    
  }
}
  