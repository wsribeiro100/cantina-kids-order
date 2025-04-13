import { TipoUsuario } from '../model/User/Enuns/TipoUsuario';

interface IUser {
    id: string;
    name: string;
    email: string;
    role: TipoUsuario;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class User implements IUser {
    id: string;
    name: string;
    email: string;
    role: TipoUsuario;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    
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
}
