<div align="center">

# 🏢 CRM Central

**Enterprise-grade Customer Relationship Management Platform**

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)

[Features](#-features) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Documentation](#-api-documentation) · [Deployment](#-deployment)

</div>

---


## 📋 Overview

CRM Central is a modern, full-stack enterprise CRM platform designed to help businesses manage customers, leads, sales pipelines, communications, support activities, tasks, teams, reporting, and business operations from a centralized system.

Built with **Java 21**, **Spring Boot 3.2**, **Angular 17**, **PostgreSQL**, and **Redis**, CRM Central delivers the power of leading CRM solutions with a modern user experience, high performance, scalability, and flexibility.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with refresh tokens
- Role-Based Access Control (RBAC) with 7 roles
- Password hashing with BCrypt
- Rate limiting and audit logging
- GDPR-ready data controls

### 👥 Customer Management
- Full customer profiles with contact details, company info, and social links
- Customer segmentation by industry, revenue, region, and tags
- Activity timeline and communication history
- Customer notes and document attachments

### 🎯 Lead Management
- Multi-source lead capture (Website, Referral, Campaign, Manual, Import)
- Lead scoring based on engagement and profile quality
- Lead-to-customer conversion workflow
- Lead assignment and status tracking

### 💰 Opportunity & Pipeline Management
- Visual Kanban-style sales pipeline with drag-and-drop
- 6-stage opportunity tracking (Prospect → Won/Lost)
- Revenue forecasting and pipeline analytics
- Conversion rate tracking and deal metrics

### 📇 Contact Management
- Comprehensive contact profiles with relationship mapping
- Contact search, filtering, and categorization
- Multi-contact support per customer

### 📋 Task Management
- Personal, team, and customer-linked tasks
- Priority levels (Low, Medium, High, Urgent)
- Due dates, reminders, and status tracking
- Time estimation and actual time tracking

### 📅 Calendar & Scheduling
- Daily, weekly, and monthly calendar views
- Meeting, call, and follow-up scheduling
- Color-coded event types
- Reminder notifications

### 📧 Email Management
- Send and track emails directly from CRM
- Email templates for quick responses
- Open rate and click tracking
- Customer and lead email linking

### 🎫 Customer Support
- Full ticket management (Create, Assign, Escalate, Resolve)
- 5 ticket categories and 5 priority levels
- Internal and external comments
- Satisfaction ratings and resolution tracking

### 📚 Knowledge Base
- Article, guide, FAQ, and tutorial management
- Full-text search with categories and tags
- View counts and helpfulness ratings
- Draft/Published/Archived workflow

### 📊 Marketing Campaigns
- Email, SMS, and social media campaign tracking
- Budget tracking and ROI analysis
- Leads generated and revenue attribution
- Campaign performance metrics

### 📈 Reporting & Analytics
- Executive, sales, and support dashboards
- Revenue reports and conversion analytics
- Customer growth and retention metrics
- Pipeline distribution visualization

### 🔔 Notification System
- In-app real-time notifications
- New lead, task, ticket, and deal alerts
- WebSocket support for live updates
- Email notification ready

### 📁 Document Management
- File upload with versioning
- Document categorization (Contracts, Invoices, Proposals)
- Customer and opportunity linked documents
- Secure access controls

### 🔍 Global Search
- Instant search across customers, leads, opportunities
- Auto-suggestions and result filtering
- Cross-module search capabilities

### 📝 Audit Logging
- Complete user action tracking
- Record update history
- Security event monitoring
- Admin change logging

### 🏢 Multi-Tenant Architecture
- Complete tenant isolation
- Company-specific settings and branding
- Per-tenant user management

### ⚡ Workflow Automation
- Configurable trigger-based rules
- Lead assignment automation
- Status change workflows
- Email sequence automation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Nginx (Reverse Proxy)              │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│   ┌──────────────┐   │   ┌──────────────────────┐   │
│   │   Angular     │   │   │   Spring Boot API     │   │
│   │   Frontend    │   │   │   (Java 21)           │   │
│   │   (Port 80)   │   │   │   (Port 8080)         │   │
│   └──────────────┘   │   └──────┬───────┬────────┘   │
│                      │          │       │            │
│                      │   ┌──────┴──┐  ┌─┴──────┐    │
│                      │   │PostgreSQL│  │ Redis  │    │
│                      │   │  (5432)  │  │ (6379) │    │
│                      │   └─────────┘  └────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Java 21+
- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (for containerized deployment)

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/basgenix4u/crm-central.git
cd crm-central

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:8080/api
# Swagger UI: http://localhost:8080/api/swagger-ui.html
```

### Manual Setup

#### Backend
```bash
cd backend

# Configure database
# Edit src/main/resources/application.yml

# Build and run
mvn clean install
mvn spring-boot:run
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build --configuration production
```

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user/company |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh-token` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/customers` | List customers |
| GET | `/api/v1/customers/{id}` | Get customer |
| POST | `/api/v1/customers` | Create customer |
| PUT | `/api/v1/customers/{id}` | Update customer |
| DELETE | `/api/v1/customers/{id}` | Delete customer |
| GET | `/api/v1/customers/search?q=` | Search customers |

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/leads` | List leads |
| POST | `/api/v1/leads` | Create lead |
| PUT | `/api/v1/leads/{id}` | Update lead |
| POST | `/api/v1/leads/{id}/convert` | Convert to customer |
| GET | `/api/v1/leads/status/{status}` | Filter by status |

### Opportunities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/opportunities` | List opportunities |
| POST | `/api/v1/opportunities` | Create opportunity |
| PATCH | `/api/v1/opportunities/{id}/stage` | Update stage |
| GET | `/api/v1/opportunities/pipeline` | Pipeline metrics |

### Additional Endpoints
- `/api/v1/contacts` - Contact management
- `/api/v1/activities` - Activity tracking
- `/api/v1/tasks` - Task management
- `/api/v1/tickets` - Support tickets
- `/api/v1/campaigns` - Campaign management
- `/api/v1/calendar` - Calendar events
- `/api/v1/emails` - Email management
- `/api/v1/documents` - Document management
- `/api/v1/notifications` - Notifications
- `/api/v1/knowledge-base` - Knowledge base
- `/api/v1/workflows` - Workflow rules
- `/api/v1/dashboard` - Dashboard metrics
- `/api/v1/search` - Global search
- `/api/v1/audit-logs` - Audit logs
- `/api/v1/users` - User management
- `/api/v1/notes` - Notes

---

## 🔒 RBAC Roles

| Role | Access Level |
|------|-------------|
| Super Admin | Full platform access |
| Admin | Company-wide management |
| Sales Manager | Sales team management |
| Sales Representative | Lead & opportunity management |
| Support Agent | Ticket management |
| Marketing Manager | Campaign management |
| Customer | Portal access (optional) |

---

## 🐳 Deployment

### Docker Compose (Production)
```bash
docker-compose -f docker-compose.yml up -d --build
```

### Kubernetes
The application is Kubernetes-ready. Deploy using the provided Docker images.

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | crmcentral |
| `DB_USERNAME` | Database user | crmcentral |
| `DB_PASSWORD` | Database password | crmcentral |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `JWT_SECRET` | JWT signing key | (generated) |
| `CORS_ORIGINS` | Allowed origins | http://localhost:4200 |

---

## 📁 Project Structure

```
crm-central/
├── backend/
│   ├── src/main/java/com/crmcentral/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data transfer objects
│   │   ├── entity/          # JPA entities
│   │   ├── enums/           # Enumerations
│   │   ├── exception/       # Exception handling
│   │   ├── repository/      # Data repositories
│   │   ├── security/        # Security & JWT
│   │   ├── service/         # Business logic
│   │   └── util/            # Utilities
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/app/
│   │   ├── core/            # Guards, interceptors, services, models
│   │   ├── shared/          # Shared components
│   │   ├── features/        # Feature modules
│   │   │   ├── auth/        # Authentication
│   │   │   ├── dashboard/   # Dashboard
│   │   │   ├── customers/   # Customer management
│   │   │   ├── leads/       # Lead management
│   │   │   ├── opportunities/ # Opportunity management
│   │   │   ├── pipeline/    # Sales pipeline
│   │   │   ├── contacts/    # Contacts
│   │   │   ├── activities/  # Activities
│   │   │   ├── tasks/       # Tasks
│   │   │   ├── calendar/    # Calendar
│   │   │   ├── email/       # Email
│   │   │   ├── support/     # Support tickets
│   │   │   ├── knowledge-base/ # Knowledge base
│   │   │   ├── campaigns/   # Campaigns
│   │   │   ├── reports/     # Reports
│   │   │   ├── notifications/ # Notifications
│   │   │   ├── documents/   # Documents
│   │   │   ├── admin/       # Admin panel
│   │   │   └── settings/    # Settings
│   │   └── layout/          # App layout
│   ├── Dockerfile
│   └── package.json
├── docker/
│   └── nginx/
├── .github/workflows/
│   └── ci-cd.yml
├── docker-compose.yml
└── README.md
```

---

## 🔮 Roadmap

### Phase 2
- AI-powered lead scoring
- AI customer insights
- AI sales forecasting
- Native mobile applications

### Phase 3
- WhatsApp integration
- Video meetings
- In-app chat system
- Customer portal

### Phase 4
- ERP integration
- Accounting integration
- Advanced business intelligence
- Predictive analytics

---

## 📄 License

Released under the [MIT License](./LICENSE).

---

<div align="center">
**CRM Central** — Your Complete Business Operating Platform

Built with ❤️ for modern businesses · [Abdulbasit Abdulalim](https://github.com/basgenix4u)

</div>
