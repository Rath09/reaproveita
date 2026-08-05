# Reaproveita — Almoxarifado Compartilhado

> **Demo ao vivo:** https://reaproveita-one.vercel.app/

<!-- SCREENSHOTS: coloque as duas imagens em docs/img/ com estes nomes (ou ajuste os links abaixo). -->
<p align="center">
  <img src="docs/img/screenshot-1.png" alt="Catálogo de itens ociosos" width="49%" />
  <img src="docs/img/screenshot-2.png" alt="Painel público de KPIs" width="49%" />
</p>

---

Plataforma que cataloga itens ociosos das secretarias municipais e permite que outras
secretarias os consultem e requisitem, evitando compras novas. Projeto desenvolvido para a
**Jornada Incubintech 2026**.

## Stack

- **Front-end:** React + Vite, [Recharts](https://recharts.org/) para os gráficos
- **Back-end:** FastAPI + SQLite, autenticação JWT
- **Contrato da API:** [`CONTRATO_API.md`](CONTRATO_API.md) — a fonte da verdade da fronteira
  entre front e back (schemas, endpoints, matching e erros, acordados entre as duas pontas)

## O que cada pessoa construiu

Projeto de três pessoas. A divisão de trabalho:

- **Rafael (eu) — Front-end.** Interface em React + Vite (catálogo com filtros, fluxo de
  requisições, interceptação de intenções e painel público), consumo da API concentrado em
  um único ponto (`frontend/src/data/api.js`) e a visualização dos KPIs com Recharts.
- **Rodrigo — Back-end (núcleo).** API em FastAPI: autenticação JWT + RBAC, máquina de
  estados das requisições e matching de intenções.
- **Gabriel — Back-end (dados).** Camada de dados em SQLite: modelos, seeds, CRUD de
  itens/secretarias/categorias e as agregações dos KPIs.

## Rodando localmente

**Front-end** (Node.js 18+):

```bash
cd frontend
npm install
npm run dev
```

**Back-end** (Python 3.11+): ver [`backend/README.md`](backend/README.md).

## Documentação

- [`CONTRATO_API.md`](CONTRATO_API.md) — contrato da API entre front e back (fonte da verdade da fronteira)
- [`docs/ORGANOGRAMA.md`](docs/ORGANOGRAMA.md) — divisão de módulos e responsabilidades
- [`docs/PLANEJAMENTO.md`](docs/PLANEJAMENTO.md) — sprints e entregas por pessoa
- [`docs/ROTEIRO_KICKOFF.md`](docs/ROTEIRO_KICKOFF.md) — roteiro da call de kickoff

## Licença

[MIT](LICENSE).
