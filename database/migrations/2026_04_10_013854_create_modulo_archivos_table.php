<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::create('modulo_archivos', function (Blueprint $table) {
        $table->id();
        $table->foreignId('modulo_id')->constrained('modulos')->onDelete('cascade');
        $table->string('nombre_archivo');
        $table->string('ruta_archivo');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modulo_archivos');
    }
};
