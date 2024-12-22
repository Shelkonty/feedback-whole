import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Создаем статусы
    const statuses = [
        { name: 'Идея' },
        { name: 'Запланировано' },
        { name: 'В работе' },
        { name: 'Выполнено' }
    ];

    for (const status of statuses) {
        await prisma.status.upsert({
            where: { name: status.name },
            update: {},
            create: status,
        });
    }

    // Создаем категории
    const categories = [
        { name: 'Функциональность' },
        { name: 'Баг' },
        { name: 'UI' },
        { name: 'Производительность' }
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: category,
        });
    }

    console.log('Seed completed');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });