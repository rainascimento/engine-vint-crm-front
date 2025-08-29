# React + Tailwind + shadcn — Skeleton (Vite) — Porta 3001

Pronto para rodar com Vite na porta **3001**, Tailwind configurado e um componente **Button** no estilo *shadcn/ui*.
O projeto já está com alias `@` e `@components` funcionando para evitar o erro de "No import alias found".

## Rodar
```bash
npm i
npm run dev  # abre em http://localhost:3001
```

> Se quiser adicionar mais componentes do shadcn via CLI:
```bash
npx shadcn@latest add card input alert-dialog
```

## Scripts
- `npm run dev` – Vite dev server em **3001**
- `npm run build` – build de produção
- `npm run preview` – preview em **3001**

## Observações
- O arquivo **vite.config.ts** já define `server.port = 3001` e `strictPort = true`.
- O **components.json** já está pronto para a CLI do shadcn.
- O **tailwind.config.js** usa o plugin `tailwindcss-animate` e escaneia `./index.html` e `./src/**/*.{ts,tsx}`.
