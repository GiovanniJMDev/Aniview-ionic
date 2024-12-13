import { Component, OnInit } from '@angular/core';
import axios from 'axios';

interface AnimeList {
  id: string;
  userId: string;
  listType: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit {
  lists: AnimeList[] = [];
  users: any[] = []; // Added users array
  error: string = '';
  showCreateModal: boolean = false;
  showDeleteModal: boolean = false;
  newList: AnimeList = {
    id: '',
    userId: '', // Updated to be set from the form
    listType: '', // Updated to be set from the form
    createdAt: '',
    updatedAt: ''
  };
  deletingList: AnimeList | null = null;

  constructor() { }

  ngOnInit() {
    this.fetchAnimeLists();
    this.fetchUsers(); // Fetch users on initialization
  }

  async fetchAnimeLists() {
    try {
      const response = await axios.get('http://localhost:8080/api/anime-lists');
      this.lists = response.data;
    } catch (error) {
      console.error('Error fetching anime lists:', error);
      this.error = 'Error al obtener listas de anime';
    }
  }

  async fetchUsers() { // New method to fetch users
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
    this.newList = {
      id: '',
      userId: '', // Reset userId for new entry
      listType: '', // Reset listType for new entry
      createdAt: '',
      updatedAt: ''
    };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    console.log('Closing create modal');
    this.showCreateModal = false;
  }

  async createList() {
    console.log('Creating list:', this.newList);
    try {
      const response = await axios.post('http://localhost:8080/api/anime-lists', {
        userId: this.newList.userId, // Pass userId from form
        listType: this.newList.listType // Pass listType from form
      });
      this.lists.push(response.data);
      this.closeCreateModal();
    } catch (error) {
      console.error('Error creating list:', error);
      this.error = 'Error al crear lista';
    }
  }

  openDeleteModal(list: AnimeList) {
    console.log('Opening delete modal for list:', list);
    this.deletingList = list;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    console.log('Closing delete modal');
    this.showDeleteModal = false;
    this.deletingList = null;
  }

  async deleteList() {
    if (this.deletingList) {
      console.log('Deleting list:', this.deletingList);
      try {
        await axios.delete(`http://localhost:8080/api/anime-lists/${this.deletingList.id}`);
        this.lists = this.lists.filter(l => l.id !== this.deletingList!.id);
        this.closeDeleteModal();
      } catch (error) {
        console.error('Error deleting list:', error);
        this.error = 'Error al eliminar lista';
      }
    }
  }
}
