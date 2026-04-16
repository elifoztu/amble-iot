import RPi.GPIO as GPIO
import time

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

pin = 18
GPIO.setup(pin, GPIO.OUT)

pwm = GPIO.PWM(pin, 50)
pwm.start(0)

LEFT = 7.5   # adjust if needed
NEUTRAL = 7.05

try:
    pwm.ChangeDutyCycle(LEFT)
    time.sleep(5)   # spin for 5 seconds

    # return to neutral briefly to stop cleanly
    pwm.ChangeDutyCycle(NEUTRAL)
    time.sleep(0.3)

finally:
    pwm.stop()
    GPIO.cleanup()
