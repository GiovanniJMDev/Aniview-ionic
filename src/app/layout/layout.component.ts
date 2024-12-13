import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  showOptionsModal = false;

  // Inyectar el servicio Router para manejar la navegación
  constructor(private router: Router) {}

  ngOnInit() {}

  // Métodos para redirigir a las rutas correspondientes y cerrar el modal
  goToAnimes() {
    this.router.navigate(['/animes']);
    this.showOptionsModal = false; // Cerrar el modal
  }

  goToUsers() {
    this.router.navigate(['/users']);
    this.showOptionsModal = false; // Cerrar el modal
  }

  goToLists() {
    this.router.navigate(['/lists']);
    this.showOptionsModal = false; // Cerrar el modal
  }
}
