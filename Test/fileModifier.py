input_file = 'disposable_email_blocklist.conf'
output_file = 'output.txt'

with open(input_file, 'r') as f:
    lines = f.readlines()

modified_lines = ['"' + line.strip() + '",\n' for line in lines]

with open(output_file, 'w') as f:
    f.writelines(modified_lines)

print('Content converted and saved to', output_file)