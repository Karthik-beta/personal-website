# 0001: Framework and hosting

- Status: Accepted
- Date: 2026-10-27

## Context

The site needs to be fast, cheap (free) to host, and easy to maintain. The domain `karthik.nz` is
on Cloudflare's free plan, and `workclock.karthik.nz` already serves a separate GitHub Pages
project.

## Options

These were set by Karthik as project constraints rather than compared.

## Decision

- Next.js (App Router) with TypeScript in strict mode, scaffolded with `create-next-app` (Next.js 16).
- Static or mostly static rendering. No features that need paid infrastructure.
- Hosted on Vercel's free Hobby tier.
- DNS stays on Cloudflare. Vercel records are DNS-only (grey cloud) unless there is a good reason
  otherwise.
- `workclock.karthik.nz` must never be modified.

## Why

Next.js on Vercel is the most common, best-documented setup for a React site. It costs nothing at
this scale. A static site is also the fastest option for visitors, which helps Core Web Vitals and
SEO.
