import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface BlogPost {
  title: string;
  url: string;
  date: string;
  tag?: string;
  snippet: string;
}

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
export class AppComponent implements OnInit {
  menuOpen = false;
  filter = 'All';
  name = '';
  email = '';
  message = '';
  errors: FormErrors = {};
  submitted = false;

  // Blog posts pulled live from the Blogger feed (JSONP — the feed has no CORS headers).
  posts: BlogPost[] = [];
  postsState: 'loading' | 'loaded' | 'error' = 'loading';

  private readonly feedUrl =
    'https://learn.tech-everyday.com/feeds/posts/default?alt=json-in-script&max-results=4';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.jsonp<any>(this.feedUrl, 'callback').subscribe({
      next: data => {
        this.posts = this.parseFeed(data);
        this.postsState = this.posts.length ? 'loaded' : 'error';
      },
      error: () => {
        this.postsState = 'error';
      },
    });
  }

  private parseFeed(data: any): BlogPost[] {
    const entries: any[] = data?.feed?.entry ?? [];
    return entries.map(e => {
      const links: any[] = e.link ?? [];
      return {
        title: e.title?.$t ?? 'Untitled',
        url: links.find(l => l.rel === 'alternate')?.href ?? 'https://learn.tech-everyday.com/',
        date: this.formatDate(e.published?.$t ?? ''),
        tag: (e.category ?? [])[0]?.term,
        snippet: this.snippet(e.summary?.$t ?? e.content?.$t ?? ''),
      };
    });
  }

  private formatDate(iso: string): string {
    if (!iso) {
      return '';
    }
    const d = new Date(iso);
    return isNaN(d.getTime())
      ? ''
      : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  private snippet(html: string): string {
    // DOMParser doesn't run scripts or fetch resources — safe for untrusted feed HTML.
    const text = (new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '')
      .replace(/\s+/g, ' ')
      .trim();
    return text.length > 140 ? text.slice(0, 140).trimEnd() + '…' : text;
  }

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
