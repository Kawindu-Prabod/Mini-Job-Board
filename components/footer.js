export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white p-6 text-center mt-10">
        <div className="flex justify-center gap-6 text-2xl mb-3">
          <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0zM7.5 8h4.8v2.24h.07c.67-1.27 2.3-2.6 4.73-2.6C21.3 7.64 24 9.58 24 14.42V24h-5v-8.25c0-1.97-.04-4.5-2.75-4.5-2.76 0-3.18 2.15-3.18 4.36V24h-5z" />
            </svg>
          </a>
          <a href="https://wa.me/123456789" target="_blank" aria-label="WhatsApp">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 32 32">
              <path d="M16 .396c-8.837 0-16 7.163-16 16 0 2.83.742 5.527 2.144 7.945l-2.217 8.142 8.392-2.19C10.45 30.982 13.19 31.6 16 31.6c8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.6c-2.6 0-5.18-.68-7.45-1.965l-.525-.29-4.982 1.302 1.34-4.917-.34-.526C2.76 21.25 2 18.664 2 16c0-7.732 6.268-14 14-14s14 6.268 14 14-6.268 14-14 14z" />
            </svg>
          </a>
          <a href="mailto:someone@example.com" aria-label="Email">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 13.065L1.5 6.75V6.6c0-1.19.96-2.15 2.15-2.15h16.7c1.19 0 2.15.96 2.15 2.15v.15L12 13.065zM1.5 8.265v9.135c0 1.19.96 2.15 2.15 2.15h16.7c1.19 0 2.15-.96 2.15-2.15V8.265l-10.3 6.315L1.5 8.265z" />
            </svg>
          </a>
        </div>
        <p className="text-sm text-gray-400">
          Made by Kawindu • Contact: example@email.com
        </p>
      </footer>
    );
  }
  