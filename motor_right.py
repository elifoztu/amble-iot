import RPi.GPIO as GPIO
import time

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

pin = 18
GPIO.setup(pin, GPIO.OUT)

pwm = GPIO.PWM(pin, 50)
pwm.start(0)

RIGHT = 6.7   # adjust if needed
NEUTRAL = 7.05

try:
    pwm.ChangeDutyCycle(RIGHT)
    time.sleep(5)

    # return to neutral briefly
    pwm.ChangeDutyCycle(NEUTRAL)
    time.sleep(0.3)

finally:
    pwm.stop()
    GPIO.cleanup()
