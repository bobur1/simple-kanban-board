<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DownloadDatabaseController extends Controller
{
    public function index()
    {
        Spatie\DbDumper\Databases\MySql::create()
            ->setDbName(env('DB_DATABASE'))
            ->setUserName(env('DB_USERNAME'))
            ->setPassword(env('DB_PASSWORD'))
            ->dumpToFile('dump.sql');
    }
}
