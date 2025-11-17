<?php
function loadEnv($filePath)
{
	if (!file_exists($filePath)) {
		return;
	}

	$lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
	foreach ($lines as $line) {
		if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
			list($name, $value) = explode('=', $line, 2);
			$name = trim($name);
			$value = trim($value);

			if (!array_key_exists($name, $_ENV)) {
				putenv(sprintf('%s=%s', $name, $value));
				$_ENV[$name] = $value;
			}
		}
	}
}
