<?php

use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'Thuy Cao',
            'email' => 'thuycao@datvesieure.com',
            'password' => app('hash')->make('thuymapdit'),
            'remember_token' => str_random(10),
        ]);
    }
}
