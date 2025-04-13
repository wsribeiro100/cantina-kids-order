
import { TipoUsuario } from './Enuns/TipoUsuario';

interface IUser {
    id: string;
    name: string;
    email: string;
    role: TipoUsuario;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    balance?: number;
    profileImage?: string;
    dietaryPreferences?: string[];
    class?: string;
}

export class User implements IUser {
    id: string;
    name: string;
    email: string;
    role: TipoUsuario;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    balance?: number;
    profileImage?: string;
    dietaryPreferences?: string[];
    class?: string;
    
    // Getters
    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getRole(): TipoUsuario {
        return this.role;
    }

    isActive(): boolean {
        return this.active;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    getBalance(): number {
        return this.balance || 0;
    }

    getProfileImage(): string {
        return this.profileImage || '';
    }

    getDietaryPreferences(): string[] {
        return this.dietaryPreferences || [];
    }

    getClass(): string {
        return this.class || '';
    }

    // Setters
    setId(id: string): void {
        this.id = id;
    }

    setName(name: string): void {
        this.name = name;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setRole(role: TipoUsuario): void {
        this.role = role;
    }

    setActive(active: boolean): void {
        this.active = active;
    }

    setCreatedAt(createdAt: Date): void {
        this.createdAt = createdAt;
    }

    setUpdatedAt(updatedAt: Date): void {
        this.updatedAt = updatedAt;
    }

    setBalance(balance: number): void {
        this.balance = balance;
    }

    setProfileImage(profileImage: string): void {
        this.profileImage = profileImage;
    }

    setDietaryPreferences(dietaryPreferences: string[]): void {
        this.dietaryPreferences = dietaryPreferences;
    }

    setClass(classValue: string): void {
        this.class = classValue;
    }
}
