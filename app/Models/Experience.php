<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    

    protected $primaryKey = 'id';


    protected $fillable = [
        'name',
        'enterprise',
        'description',
        'url',
        'image',
        'start_date',
        'end_date',
        'technologies',
    ];

    protected $casts = [
        'technologies' => 'array',
    ];
}
