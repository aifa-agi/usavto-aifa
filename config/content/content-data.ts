import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";

export const contentData = {
  categories: [
  {
    "title": "Путевые листы",
    "href": "/putevye-listy",
    "pages": [],
    "order": 15
  },
  {
    "title": "ЭПЛ",
    "href": "/epl",
    "pages": [],
    "order": 8
  },
  {
    "title": "Телемедицина",
    "href": "/telemeditsina",
    "pages": [],
    "order": 10
  },
  {
    "title": "Предрейсовый технический осмотр",
    "href": "/predreysovyy-tehnicheskiy-osmotr",
    "pages": [],
    "order": 9
  },
  {
    "title": "Управление штрафами",
    "href": "/upravlenie-shtrafami",
    "pages": [],
    "order": 11
  },
  {
    "title": "Уведомления и мониторинг документов",
    "href": "/uvedomleniya-i-monitoring-dokumentov",
    "pages": [],
    "order": 12
  },
  {
    "title": "home",
    "pages": [
      {
        "id": "ks7eqcf6z1fhes1lwiwz75zn",
        "linkName": "home-page",
        "href": "/home/home-page",
        "roles": [
          "guest"
        ],
        "hasBadge": false,
        "type": "homePage",
        "isPublished": false,
        "isAddedToPrompt": false,
        "isVectorConnected": false,
        "isChatSynchronized": false,
        "order": 1,
        "title": "aifa",
        "description": "AI generator",
        "images": [
          {
            "id": "o2srus4w0jgeo81r96gyb55r",
            "alt": "Logo",
            "href": "https://9d8adypzz8xutnay.public.blob.vercel-storage.com/logo-DdZf25dGZUGryUbrmCK29xtMK5w1cw.png"
          }
        ],
        "keywords": [
          "Ai"
        ]
      }
    ],
    "order": 5
  },
  {
    "title": "Образовательные услуги",
    "href": "/obrazovatelnye-uslugi",
    "pages": [],
    "order": 13
  },
  {
    "title": "Дополнительные сервисы и аутсорсинг",
    "href": "/dopolnitelnye-servisy-i-autsorsing",
    "pages": [],
    "order": 14
  },
  {
    "title": "root",
    "pages": [
      {
        "id": "om8aaom6s12e89f3e22yp6k9",
        "linkName": "term",
        "href": "/root/term",
        "roles": [
          "guest"
        ],
        "hasBadge": false,
        "type": "blog",
        "isPublished": false,
        "isAddedToPrompt": false,
        "isVectorConnected": false,
        "isChatSynchronized": false,
        "order": 1
      }
    ],
    "order": 6
  },
  {
    "title": "admin",
    "pages": [
      {
        "id": "r70rhidyb8w0o8ikzuuu8nil",
        "linkName": "vercel-deploy",
        "href": "/admin/vercel-deploy",
        "roles": [
          "guest"
        ],
        "hasBadge": false,
        "type": "blog",
        "isPublished": false,
        "isAddedToPrompt": false,
        "isVectorConnected": false,
        "isChatSynchronized": false,
        "order": 1
      },
      {
        "id": "xyv6gexz8wkjdi1klh0hd87i",
        "linkName": "all-users",
        "href": "/admin/all-users",
        "roles": [
          "guest",
          "admin"
        ],
        "hasBadge": false,
        "type": "blog",
        "isPublished": false,
        "isAddedToPrompt": false,
        "isVectorConnected": false,
        "isChatSynchronized": false,
        "order": 2
      }
    ],
    "order": 4
  }
]
} as { categories: MenuCategory[] };

export type contentData = typeof contentData;

export const lastUpdated = "2025-09-24T01:06:51.959Z";
export const generatedBy = "menu-persist-api";
