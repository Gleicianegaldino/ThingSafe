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
        Schema::create('alert_perimeter_break', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('topic_perimeter_break');
            $table->integer('status');
            $table->integer('qos');
            $table->dateTime('created_at')->nullable();

            $table->unsignedBigInteger('smart_cone_id');
            $table->foreign('smart_cone_id')->references('id')->on('smart_cone');

            $table->foreign('topic_perimeter_break')->references('topic_perimeter_break')->on('smart_cone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alert_perimeter_break');
    }
};
