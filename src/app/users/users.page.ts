import { Component, OnInit } from '@angular/core';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  name: string;
  lastname: string;
  email: string;
  password?: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users: User[] = [];
  userLists: any[] = [];
  userName: string = '';
  error: string = '';
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showCreateModal: boolean = false;
  showListModal: boolean = false; // Added for list modal
  editingUser: User = {
    id: '',
    username: '',
    name: '',
    lastname: '',
    email: '',
    password: ''
  };
  deletingUser: User | null = null;
  newUser: User = {
    id: '',
    username: '',
    name: '',
    lastname: '',
    email: '',
    password: ''
  };

  constructor() { }

  ngOnInit() {
    this.fetchUsers();
  }

  async fetchUsers() {
    try {
      const response = await axios.get('http://localhost:8080/api/users');
      this.users = response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      this.error = 'Error al obtener usuarios';
    }
  }

  openCreateModal() {
    console.log('Opening create modal');
    this.newUser = {
      id: '',
      username: '',
      name: '',
      lastname: '',
      email: '',
      password: ''
    };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    console.log('Closing create modal');
    this.showCreateModal = false;
    this.newUser = {
      id: '',
      username: '',
      name: '',
      lastname: '',
      email: '',
      password: ''
    };
  }

  async createUser() {
    console.log('Creating user:', this.newUser);
    try {
      const response = await axios.post('http://localhost:8080/api/users', this.newUser);
      this.users.push(response.data);
      this.closeCreateModal();
    } catch (error) {
      console.error('Error creating user:', error);
      this.error = 'Error al crear usuario';
    }
  }

  openEditModal(user: User) {
    console.log('Opening edit modal for user:', user);
    this.editingUser = {...user};
    this.showEditModal = true;
  }

  closeEditModal() {
    console.log('Closing edit modal');
    this.showEditModal = false;
    this.editingUser = {
      id: '',
      username: '',
      name: '',
      lastname: '',
      email: '',
      password: ''
    };
  }

  async updateUser() {
    console.log('Updating user:', this.editingUser);
    try {
      await axios.put(`http://localhost:8080/api/users/${this.editingUser.id}`, this.editingUser);
      const index = this.users.findIndex(u => u.id === this.editingUser.id);
      if (index !== -1) {
        this.users[index] = {...this.editingUser};
      }
      this.closeEditModal();
    } catch (error) {
      console.error('Error updating user:', error);
      this.error = 'Error al actualizar usuario';
    }
  }

  openDeleteModal(user: User) {
    console.log('Opening delete modal for user:', user);
    this.deletingUser = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    console.log('Closing delete modal');
    this.showDeleteModal = false;
    this.deletingUser = null;
  }

  async deleteUser() {
    if (this.deletingUser) {
      console.log('Deleting user:', this.deletingUser);
      try {
        await axios.delete(`http://localhost:8080/api/users/${this.deletingUser.id}`);
        this.users = this.users.filter(u => u.id !== this.deletingUser!.id);
        this.closeDeleteModal();
      } catch (error) {
        console.error('Error deleting user:', error);
        this.error = 'Error al eliminar usuario';
      }
    }
  }

  async openListModal(user: User) {
    console.log('Opening list modal for user:', user);
    this.userName = `${user.name} ${user.lastname}`;
    try {
      const response = await axios.get(`http://localhost:8080/api/anime-lists/user/${user.id}`);
      this.userLists = response.data;
      this.showListModal = true;
    } catch (error) {
      console.error('Error fetching user lists:', error);
      this.error = 'Error al obtener listas de usuario';
    }
  }

  closeListModal() {
    console.log('Closing list modal');
    this.showListModal = false;
  }
}
