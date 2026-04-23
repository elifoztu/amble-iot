#!/usr/bin/env python3

import time
import RPi.GPIO as GPIO

SERVO_PIN = 18  # PWM-capable pin on Raspberry Pi 4
FREQUENCY = 50  # 50 Hz for standard analog servos

ANGLE_MIN = 45
ANGLE_MAX = 135
STEP = 1.5
DELAY = 0.02


def angle_to_duty_cycle(angle):
    # Map 0-180 degrees to 2.5-12.5% duty cycle for a standard servo
    return 2.5 + (angle / 180.0) * 10.0


def setup():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(SERVO_PIN, GPIO.OUT)
    pwm = GPIO.PWM(SERVO_PIN, FREQUENCY)
    pwm.start(angle_to_duty_cycle(90))
    return pwm


def sweep_servo(pwm):
    angle = ANGLE_MIN
    direction = 1

    while True:
        duty = angle_to_duty_cycle(angle)
        pwm.ChangeDutyCycle(duty)
        time.sleep(DELAY)

        angle += STEP * direction
        if angle >= ANGLE_MAX:
            angle = ANGLE_MAX
            direction = -1
        elif angle <= ANGLE_MIN:
            angle = ANGLE_MIN
            direction = 1


def cleanup(pwm):
    pwm.stop()
    GPIO.cleanup()


if __name__ == "__main__":
    pwm = setup()
    try:
        sweep_servo(pwm)
    except KeyboardInterrupt:
        pass
    finally:
        cleanup(pwm)

# stop the motor 
