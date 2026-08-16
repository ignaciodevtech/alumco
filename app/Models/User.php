<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'sexo',
        'fecha_nacimiento',
        'sede',
        'rol',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'fecha_nacimiento' => 'date',
        ];
    }
    
    public function cursosDictados()
    {
        return $this->hasMany(Curso::class, 'profesor_id');
    }

    public function cursosInscritos()
    {
        return $this->belongsToMany(Curso::class, 'inscripciones', 'alumno_id', 'curso_id')
                    ->withPivot('estado')
                    ->withTimestamps();
    }
    
    public function cursos()
    {
        return $this->hasMany(Curso::class, 'profesor_id');
    }

    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'user_id');
    }

    public function modulosCompletados()
    {
    }

}