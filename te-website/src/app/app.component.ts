import { Component } from '@angular/core';

interface Project {
  name: string;
  cat: string;
  tags: string;
  label: string;
  href: string;
  blurb: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type Field = 'name' | 'email' | 'message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  menuOpen = false;
  // Flip to true once there's a real blog to link to.
  showWriting = false;
  filter = 'All';
  name = '';
  email = '';
  message = '';
  errors: FormErrors = {};
  submitted = false;

  readonly categories = ['All', 'Web', 'Backend', 'Mobile', 'AI'];

  readonly projects: Project[] = [
    {
      name: 'dotnet_api', cat: 'Backend', tags: 'C# · .NET', label: '.NET REST API',
      href: 'https://github.com/TechEveryday/dotnet_api',
      blurb: 'A clean-architecture REST service in C# / .NET, built for reliability and easy extension.'
    },
    {
      name: 'ionic-angular', cat: 'Mobile', tags: 'TypeScript · Ionic', label: 'Ionic mobile app',
      href: 'https://github.com/TechEveryday/ionic-angular',
      blurb: 'Cross-platform mobile app on Ionic + Angular — one codebase for iOS and Android.'
    },
    {
      name: 'odd-one-out', cat: 'Web', tags: 'Vue · SPA', label: 'Vue card game',
      href: 'https://github.com/TechEveryday/odd-one-out',
      blurb: 'A multiplayer card game built in Vue — design, game logic, and UI end to end.'
    },
    {
      name: 'agentic-ai-journey', cat: 'AI', tags: 'TypeScript · LLM', label: 'Agentic AI',
      href: 'https://github.com/TechEveryday/agentic-ai-journey',
      blurb: 'Experiments turning LLMs into dependable agent workflows for real product features.'
    },
    {
      name: 'viraphilavong.github.io', cat: 'Web', tags: 'Vue', label: 'Personal site',
      href: 'https://github.com/viraphilavong/viraphilavong.github.io',
      blurb: 'A personal site and playground built in Vue, iterating on layout and interaction ideas.'
    },
  ];

  get filteredProjects(): Project[] {
    return this.filter === 'All'
      ? this.projects
      : this.projects.filter(p => p.cat === this.filter);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  setFilter(cat: string): void {
    this.filter = cat;
  }

  setField(key: Field, value: string): void {
    this[key] = value;
    delete this.errors[key];
  }

  validate(): FormErrors {
    const e: FormErrors = {};
    if (!this.name.trim()) {
      e.name = 'Please enter your name.';
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email.trim())) {
      e.email = 'Enter a valid email address.';
    }
    if (this.message.trim().length < 10) {
      e.message = 'A little more detail helps (10+ characters).';
    }
    return e;
  }

  onSubmit(ev: Event): void {
    ev.preventDefault();
    const errors = this.validate();
    if (Object.keys(errors).length) {
      this.errors = errors;
      return;
    }
    const subject = encodeURIComponent(`Project inquiry from ${this.name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${this.name.trim()}\nEmail: ${this.email.trim()}\n\n${this.message.trim()}`
    );
    window.location.href =
      `mailto:alexander@tech-everyday.com?subject=${subject}&body=${body}`;
    this.submitted = true;
  }
}
