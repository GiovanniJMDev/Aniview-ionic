import { Component, OnInit } from '@angular/core';
import axios from 'axios';

interface Anime {
  title: string;
  image: string;
  genres: string[];
  description: string;
  rating: number;
  platforms: string[];
  yearStarted: number;
  yearEnded: number;
  seasons: number;
  episodesPerSeason: number[];
  totalViews: number;
  weeklyViews: number;
  id: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  animes: Anime[] = [];
  error: string = '';
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showCreateModal: boolean = false;
  editingAnime: Anime = {
    title: '',
    image: '',
    genres: [],
    description: '',
    rating: 0,
    platforms: [],
    yearStarted: 0,
    yearEnded: 0,
    seasons: 0,
    episodesPerSeason: [],
    totalViews: 0,
    weeklyViews: 0,
    id: 0
  };
  deletingAnime: Anime | null = null;

  constructor() {}

  ngOnInit() {
    axios.get<Anime[]>('http://localhost:8080/api/anime')
      .then(response => {
        this.animes = response.data;
        this.error = '';
      })
      .catch(error => {
        console.error('Error fetching anime data:', error);
        if (error.response) {
          // Server responded with error
          this.error = `Server error ${error.response.status}: ${error.response.data.message || 'Unknown error'}`;
        } else if (error.request) {
          // Request made but no response
          this.error = 'No response from server. Please check if the API is running.';
        } else {
          // Error in request setup
          this.error = error.message || 'An unknown error occurred';
        }
      });
  }

  openCreateModal() {
    this.editingAnime = {
      title: '',
      image: '',
      genres: [],
      description: '',
      rating: 0,
      platforms: [],
      yearStarted: 0,
      yearEnded: 0,
      seasons: 0,
      episodesPerSeason: [],
      totalViews: 0,
      weeklyViews: 0,
      id: 0
    };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.editingAnime = {
      title: '',
      image: '',
      genres: [],
      description: '',
      rating: 0,
      platforms: [],
      yearStarted: 0,
      yearEnded: 0,
      seasons: 0,
      episodesPerSeason: [],
      totalViews: 0,
      weeklyViews: 0,
      id: 0
    };
  }

  createAnime() {
    const { id, ...animeWithoutId } = this.editingAnime;
    
    const animeToCreate = {
      ...animeWithoutId,
      genres: typeof this.editingAnime.genres === 'string' 
        ? (this.editingAnime.genres as string).split(',').map(g => g.trim())
        : this.editingAnime.genres,
      platforms: typeof this.editingAnime.platforms === 'string'
        ? (this.editingAnime.platforms as string).split(',').map(p => p.trim())
        : this.editingAnime.platforms,
      episodesPerSeason: typeof this.editingAnime.episodesPerSeason === 'string'
        ? (this.editingAnime.episodesPerSeason as string).split(',').map(e => parseInt(e.trim()))
        : this.editingAnime.episodesPerSeason
    };

    axios.post('http://localhost:8080/api/anime', animeToCreate)
      .then(response => {
        this.animes.push(response.data);
        this.closeCreateModal();
      })
      .catch(error => {
        console.error('Error creating anime:', error);
        this.error = 'Error al crear el anime';
      });
  }

  openEditModal(anime: Anime) {
    this.editingAnime = {...anime};
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingAnime = {
      title: '',
      image: '',
      genres: [],
      description: '',
      rating: 0,
      platforms: [],
      yearStarted: 0,
      yearEnded: 0,
      seasons: 0,
      episodesPerSeason: [],
      totalViews: 0,
      weeklyViews: 0,
      id: 0
    };
  }

  updateAnime() {
    const index = this.animes.findIndex(a => a.id === this.editingAnime.id);
    if (index !== -1) {
      axios.put(`http://localhost:8080/api/anime/${this.editingAnime.id}`, this.editingAnime)
        .then(() => {
          this.animes[index] = {...this.editingAnime};
          this.closeEditModal();
        })
        .catch(error => {
          console.error('Error updating anime:', error);
          this.error = 'Error al actualizar el anime';
        });
    }
  }

  openDeleteModal(anime: Anime) {
    this.deletingAnime = anime;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deletingAnime = null;
  }

  deleteAnime() {
    if (this.deletingAnime) {
      axios.delete(`http://localhost:8080/api/anime/${this.deletingAnime.id}`)
        .then(() => {
          this.animes = this.animes.filter(a => a.id !== this.deletingAnime!.id);
          this.closeDeleteModal();
        })
        .catch(error => {
          console.error('Error deleting anime:', error);
          this.error = 'Error al eliminar el anime';
        });
    }
  }
}
