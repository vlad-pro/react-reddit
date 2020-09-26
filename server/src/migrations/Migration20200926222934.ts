import { Migration } from '@mikro-orm/migrations';

export class Migration20200926222934 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "title" to "username";');
  }

}
