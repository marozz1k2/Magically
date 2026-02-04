# Волшебный — фронтенд

Фронтенд проекта «Волшебный» — это веб‑приложение на Next.js (App Router) для генерации и публикации визуального контента, управления профилем, платежами и библиотекой работ. Ниже — подробное описание структуры, ключевых пользовательских сценариев и технического устройства.

## Быстрый старт

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Архитектура и маршрутизация

### App Router и сегменты

- Проект использует App Router (`app/`) с сегментами `(auth)` и `(root)` для разделения гостевых и основной части приложения. В корневом лэйауте подключаются шрифты Geist, глобальные провайдеры и Telegram WebApp скрипт. (`app/layout.tsx`).
- Основной лэйаут `(root)` отвечает за общую навигацию — боковую панель и мобильный нижний бар. (`app/(root)/layout.tsx`, `components/shared/AppSidebar.tsx`, `components/shared/Bottombar.tsx`).
- Для отсутствующих страниц предусмотрен catch‑all маршрут, который вызывает `notFound()`. (`app/(root)/[...rest]/page.tsx`).

### Главные разделы

- **Explore / Главная** — бесконечная лента публикаций с карточками и звёздным фоном. Реализован infinite scroll через `IntersectionObserver` и обработка состояний загрузки/ошибки/пустого результата. (`components/pages/sections/Explore.tsx`).
- **Поиск** — вкладки для поиска пользователей и публикаций, дебаунс запроса, рекомендованные пользователи при пустом запросе и ленивый догруз фида. (`components/pages/sections/Search.tsx`).
- **Библиотека** — вкладки «Jobs» и «Gallery»: история генераций и личная галерея с возможностью публикации в ленту. (`components/pages/sections/Library.tsx`).
- **Профиль** — карточка пользователя, статистика, публикации, быстрые действия (история расходов, активность, переход к моделям), редактирование профиля. (`components/pages/sections/Profile.tsx`).
- **Настройки** — переключение языка и темы, выход из аккаунта. (`components/pages/sections/Settings.tsx`).
- **Транзакции** — история списаний/начислений с указанием даты и суммы. (`components/pages/sections/Transactions.tsx`).

## Генерация контента и креативные инструменты

### Модели и «Magic Photo»

- Раздел **Models** показывает список AI‑моделей пользователя, карточки с превью, создание/редактирование/удаление моделей и быстрый переход к «Magic Photo». (`components/pages/generations/models/Models.tsx`).
- **Magic Photo** — форма генерации изображения по промпту: выбор модели, аспект‑ratio, публикация результата. После успешной генерации — редирект в библиотеку. (`components/pages/generations/models/magic-photo/MagicPhoto.tsx`).

### Фото‑ и видео‑эффекты

- **Photo Generate** — генерация изображений с возможностью загрузить референс, выбрать соотношение сторон, модель и публикацию результата. (`components/pages/generations/effects/photo/Generate.tsx`).
- **Photo Editor** — каталог пресетов (низкий угол, вид сверху, профиль и т. д.) с карточками‑плитками. (`components/pages/generations/effects/photo/PhotoEditor.tsx`).
- **Video Effects** — список анимаций (motions) с выбором конкретного эффекта. (`components/pages/generations/effects/video/VideoEffects.tsx`).
- **Generate Video** — форма генерации видео на базе выбранного motion: промпт, качество, изображения, публикация. (`components/pages/generations/effects/video/GenerateVideo.tsx`).

## Публикации и взаимодействия

- Страница публикации отображает медиа (изображение/видео), автора, лайки, комментарии и действия над публикацией. (`components/pages/dynamic/Publication.tsx`).
- Для доступа к публикациям используется динамический маршрут `publications/[publicationId]`. (`app/(root)/publications/[publicationId]/page.tsx`).

## Аутентификация и восстановление доступа

- В `(auth)` сегменте находятся экраны логина, регистрации, восстановления и сброса пароля, все с единым звездным фоном. (`app/(auth)/*/page.tsx`).
- Логин поддерживает классическую форму, Telegram Login Widget и вход через Google. (`components/pages/auth/Login.tsx`).
- Регистрация — многошаговая (email → OTP → данные профиля). (`components/pages/auth/Register.tsx`).
- Сброс пароля и восстановление — отдельные формы и состояния. (`components/pages/auth/ForgotPassword.tsx`, `components/pages/auth/ResetPassword.tsx`).
- Для Telegram WebApp предусмотрен авто‑логин через `initData` и инициализация SDK на стороне клиента. (`app/providers/TelegramProvider.tsx`, `app/layout.tsx`).

## Платежи и баланс

- Экран пополнения баланса использует виджет bePaid: запрос токена платежа, определение валюты, расчёт токенов, обработка статусов. (`components/pages/sections/Pay.tsx`).
- Страницы результата платежа (success/fail/decline/cancel) показывают итог и краткие данные транзакции. (`app/(root)/payment/*/page.tsx`).

## Данные и состояние

- Данные запрашиваются через `axios` с базовым URL из `NEXT_PUBLIC_API_URL`, работа идёт через `api/v1`. (`lib/api.ts`).
- Кеширование и мутации организованы через `@tanstack/react-query` с глобальными настройками ретраев. (`app/providers/QueryProvider.tsx`, `hooks/useAuth.ts`).
- В приложении используется набор доменных hooks: `useAuth`, `usePublications`, `useAi`, `useGallery`, `useTransactions`, `useHiggsfield` и др. (`hooks/*`).

## Реал‑тайм и уведомления

- После входа запускается `socket.io`‑подключение для обновления статусов генерации и оповещений. (`hooks/useSocket.ts`, `app/providers/ClientLayout.tsx`).

## Темы, стили и UI‑кит

- Тема переключается через `next-themes`, по умолчанию — dark. (`app/providers/ThemeProviders.tsx`).
- Стили построены на Tailwind CSS v4 с кастомными токенами, утилитами и компонентными классами. (`app/globals.css`).
- UI построен на компонентах Radix UI и кастомных magic‑компонентах для визуальных эффектов. (`package.json`, `components/ui/**`).

## Локализация

- Поддерживаются `ru` и `en` локали; сообщения подгружаются через `next-intl` из `messages/*.json`. (`app/i18n/config.ts`, `app/i18n/requests.ts`).
- Переключатель языка доступен в настройках и боковой панели. (`components/pages/sections/Settings.tsx`, `components/shared/AppSidebar.tsx`).

## Структура ключевых директорий

- `app/` — маршруты, лэйауты, провайдеры, i18n.
- `components/` — страницы, общие блоки, UI‑компоненты.
- `hooks/` — клиентские hooks для данных, аутентификации, генераций и сокетов.
- `lib/` — API‑клиент, утилиты и схемы валидации.
- `messages/` — локализационные файлы.

## Разработка

- Используются React 19 и Next.js 16 (App Router). (`package.json`).
- Валидация форм — `react-hook-form` + `zod`. (`components/pages/**`, `lib/validation`).
- Иконки — `lucide-react`, анимации — `framer-motion`. (`package.json`).
