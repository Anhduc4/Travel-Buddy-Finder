package com.travelbuddy.joinrequestservice.config;
import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Component;
import javax.crypto.SecretKey; import java.nio.charset.StandardCharsets;
@Component
public class JwtUtil {
    @Value("${jwt.secret}") private String secret;
    private SecretKey getSigningKey() { return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); }
    public Long extractUserId(String token) { return Long.parseLong(extractAllClaims(token).getSubject()); }
    public boolean validateToken(String token) {
        try { extractAllClaims(token); return true; } catch (JwtException | IllegalArgumentException e) { return false; }
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
    }
}
