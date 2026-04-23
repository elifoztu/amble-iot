import time
import subprocess
import lgpio

# Terminate any running fanSweep.py process
try:
    subprocess.run(['pkill', '-f', 'fanSweep.py'], timeout=2)
    time.sleep(0.5)  # Give GPIO time to be released
except Exception as e:
    print(f"Note: {e}")

# Open GPIO chip and allocate pin 18
h = lgpio.gpiochip_open(0)  # GPIO chip 0
pin = 18

try:
    # Set pin as output
    lgpio.gpio_claim_output(h, pin)
    
    # PWM parameters: frequency=50Hz, pulse width for neutral (stop) position
    # Neutral is typically around 1.5ms, which is 7.5% duty cycle at 50Hz
    NEUTRAL_PULSE = 1500  # microseconds
    FREQUENCY = 50
    
    # Generate PWM signal at neutral position (stop)
    lgpio.gpio_PWM(h, pin, FREQUENCY, NEUTRAL_PULSE)
    time.sleep(0.5)  # Hold for 0.5 seconds
    
finally:
    # Stop PWM and cleanup
    lgpio.gpio_PWM(h, pin, 0, 0)
    lgpio.gpiochip_close(h)
