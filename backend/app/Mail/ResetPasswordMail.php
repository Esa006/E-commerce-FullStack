<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;
    public $email;

    /**
     * Create a new message instance.
     */
    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $resetUrl = "http://localhost:5173/reset-password?token=" . $this->token . "&email=" . urlencode($this->email);

        return $this->subject('Reset Your Forever Password')
                    ->view('emails.reset_password')
                    ->with([
                        'resetUrl' => $resetUrl,
                    ]);
    }
}
