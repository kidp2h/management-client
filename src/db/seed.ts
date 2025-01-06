import { db } from '.';
import { records } from './schema';
import { clerkClient } from '@clerk/nextjs/server';
import { sleep } from '@/lib/utils';

function removeAccents(str) {
  return str
    .normalize('NFD') // Tách các dấu khỏi ký tự
    .replace(/[\u0300-\u036F]/g, '') // Xóa các dấu
    .replace(/đ/g, 'd') // Thay 'đ' bằng 'd'
    .replace(/Đ/g, 'D'); // Thay 'Đ' bằng 'D'
}
const seed = async () => {
  // Initialize PostgreSQL connection

  // Seed users
  let listRecords = await db.select().from(records);
  listRecords = listRecords.reverse();
  console.log(listRecords);

  for (const record of listRecords) {
    try {
      const data = await clerkClient().users.createUser({
        username: removeAccents(record.fullName)
          .replace(/\s/g, '')
          .toUpperCase(),
        password: removeAccents(record.fullName).replace(/\s/g, ''),
        emailAddress: [
          `${removeAccents(record.fullName).replace(/\s/g, '')}@gmail.com`,
        ],
        publicMetadata: {
          role: [
            {
              id: '18283e7a-33d8-4a79-94a0-73ba75dd6c83',
              name: 'Giảng viên',
            },
          ],
          record: {
            id: record.id,
            code: record.code,
          },
        },
      });
      sleep(3000);
      console.log(data);
    } catch (e) {
      console.log('Error', e);
      sleep(3000);
    }
    sleep(3000);
  }
};
seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seeding completed');
    process.exit(0);
  });
